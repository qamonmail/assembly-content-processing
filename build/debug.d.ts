/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/MessageContentV1Pack
 * @param subjectBytes `~lib/typedarray/Uint8Array`
 * @param signature `~lib/typedarray/Uint8Array`
 * @param attacheds `~lib/typedarray/Uint8Array`
 * @param previousMessageAddress `~lib/typedarray/Uint8Array`
 * @param bodyBytes `~lib/typedarray/Uint8Array`
 * @returns `~lib/typedarray/Uint8Array`
 */
export declare function MessageContentV1Pack(subjectBytes: Uint8Array, signature: Uint8Array, attacheds: Uint8Array, previousMessageAddress: Uint8Array, bodyBytes: Uint8Array): Uint8Array;
/**
 * assembly/index/MessageContentV1Unpack
 * @param data `~lib/typedarray/Uint8Array`
 * @returns `~lib/array/Array<~lib/typedarray/Uint8Array>`
 */
export declare function MessageContentV1Unpack(data: Uint8Array): Array<Uint8Array>;
